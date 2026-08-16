/** Package-owned durable finance-workflow record invariants. @module @deepseek-ai/dsh-tool-financial-research/invariant */

import type { Context } from '@deepseek-ai/cordis'
import type { Session, SessionEvent } from '@deepseek-ai/dsh-session'
import type { InvariantFailure, InvariantInstaller } from '@deepseek-ai/dsh-invariants'
import type {} from './types.ts'

const PACKAGE_NAME = '@deepseek-ai/dsh-tool-financial-research'

/** Cordis companion plugin name. */
export const name = 'tool-financial-research-invariant'
/** Services required to validate existing and newly appended Session logs. */
export const inject = ['invariants']

type FinanceTrace = Map<string, { ended: boolean }>

function isFinanceRecordEvent(event: SessionEvent): boolean {
  return event.type.startsWith('tool-financial-research/')
}

function recordOf(event: SessionEvent, fail: InvariantFailure): Record<string, unknown> {
  const data: unknown = event.data
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    fail(`${event.type} data must be a JSON object`)
  }
  return data as Record<string, unknown>
}

function stringId(value: unknown, label: string, fail: InvariantFailure): string {
  if (typeof value !== 'string' || value.length === 0) fail(`${label} must be a non-empty string`)
  return value
}

function cloneTraceForEvent(
  source: FinanceTrace,
  event: SessionEvent,
  fail: InvariantFailure,
): FinanceTrace {
  const trace = new Map(source)
  if (event.type === 'tool-financial-research/run-start') return trace
  const data = recordOf(event, fail)
  const runId = stringId(data.runId, `${event.type} runId`, fail)
  const run = source.get(runId)
  if (run !== undefined) trace.set(runId, { ended: run.ended })
  return trace
}

function openRun(trace: FinanceTrace, runId: string, eventType: string, fail: InvariantFailure): { ended: boolean } {
  const run = trace.get(runId)
  if (run === undefined) fail(`${eventType} has no matching tool-financial-research/run-start for run ${runId}`)
  if (run.ended) fail(`${eventType} appears after tool-financial-research/run-end for run ${runId}`)
  return run
}

function applyEvent(trace: FinanceTrace, event: SessionEvent, fail: InvariantFailure): void {
  const data = recordOf(event, fail)
  const runId = stringId(data.runId, `${event.type} runId`, fail)
  switch (event.type) {
    case 'tool-financial-research/run-start':
      if (typeof data.topic !== 'string' || data.topic.length === 0) {
        fail('tool-financial-research/run-start topic must be a non-empty string')
      }
      if (trace.has(runId)) fail(`tool-financial-research/run-start repeats run ${runId}`)
      trace.set(runId, { ended: false })
      return
    case 'tool-financial-research/run-end': {
      const run = openRun(trace, runId, event.type, fail)
      if (data.stopReason !== 'completed' && data.stopReason !== 'cancelled' && data.stopReason !== 'error') {
        fail(`tool-financial-research/run-end stopReason ${String(data.stopReason)} is invalid`)
      }
      if (!Array.isArray(data.artifactKinds) || data.artifactKinds.some(kind => typeof kind !== 'string')) {
        fail('tool-financial-research/run-end artifactKinds must be a string array')
      }
      run.ended = true
      return
    }
    default:
      fail(`unknown tool-financial-research event type ${event.type}`)
  }
}

const install: InvariantInstaller = Object.assign((ctx: Context, fail: InvariantFailure) => {
  const traces = new WeakMap<Session, FinanceTrace>()
  const staged = new WeakMap<SessionEvent, { session: Session; trace: FinanceTrace }>()

  const seed = (session: Session): FinanceTrace => {
    const trace: FinanceTrace = new Map()
    for (const event of session.events.filter(isFinanceRecordEvent)) applyEvent(trace, event, fail)
    traces.set(session, trace)
    return trace
  }
  ctx.sessions.list().forEach(seed)
  ctx.on('session/created', (session) => { seed(session) }, { global: true })
  ctx.on('internal/dispatch', (_mode, eventName, args) => {
    if (eventName !== 'session/event') return
    const [session, event] = args as [Session, SessionEvent]
    if (!isFinanceRecordEvent(event)) return
    const trace = cloneTraceForEvent(traces.get(session) as FinanceTrace, event, fail)
    applyEvent(trace, event, fail)
    staged.set(event, { session, trace })
  }, { global: true })
  ctx.on('session/event', (session, event) => {
    if (!isFinanceRecordEvent(event)) return
    const candidate = staged.get(event)
    /* v8 ignore next 2 -- internal/dispatch stages the exact session/event callback arguments. */
    if (candidate === undefined || candidate.session !== session) {
      return fail('session/event reached publication without matching finance-record validation')
    }
    staged.delete(event)
    traces.set(session, candidate.trace)
  }, { global: true })
}, { inject: ['sessions'] })

/** Register this package's invariant companion. */
export const apply = (ctx: Context): Promise<() => void> =>
  Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install))
