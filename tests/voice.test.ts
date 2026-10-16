import { beforeAll, describe, expect, it } from 'vite-plus/test'
import { builtPages, htmlToText, requireFreshBuild } from './built-output'

/**
 * The voice rule from DESIGN.md, observed in the delivered pages: no em dashes
 * anywhere, and date ranges that read "to" instead of a dash. Every built page
 * is read, so a new route is covered the moment it ships.
 */

/** A dashed range between a month/year and another month/year, "present", or a year. */
const RANGE_DASH =
  /(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}|\b\d{4})\s*[-\u2013\u2014]\s*(?:\d{4}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*|present|now)\b/i

beforeAll(() => {
  requireFreshBuild()
})

describe('the site voice', () => {
  it('ships no em dash on any page', () => {
    const offenders = builtPages()
      .filter((page) => page.html.includes('\u2014') || page.html.includes('&mdash;'))
      .map((page) => page.path)
    expect(offenders).toEqual([])
  })

  it('reads date ranges "to", never with a dash', () => {
    const offenders = builtPages()
      .filter((page) => RANGE_DASH.test(htmlToText(page.html)))
      .map((page) => page.path)
    expect(offenders).toEqual([])
  })
})
