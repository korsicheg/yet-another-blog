import { describe, it, expect } from 'vitest'
import { hashVisitorId, getClientIp, getCountry } from './analytics'

describe('hashVisitorId', () => {
  it('returns a 16-character hex string', () => {
    const result = hashVisitorId('127.0.0.1', 'Mozilla/5.0')
    expect(result).toMatch(/^[a-f0-9]{16}$/)
  })

  it('returns consistent results for same inputs on same day', () => {
    const a = hashVisitorId('1.2.3.4', 'Chrome')
    const b = hashVisitorId('1.2.3.4', 'Chrome')
    expect(a).toBe(b)
  })

  it('returns different results for different IPs', () => {
    const a = hashVisitorId('1.2.3.4', 'Chrome')
    const b = hashVisitorId('5.6.7.8', 'Chrome')
    expect(a).not.toBe(b)
  })

  it('returns different results for different user agents', () => {
    const a = hashVisitorId('1.2.3.4', 'Chrome')
    const b = hashVisitorId('1.2.3.4', 'Firefox')
    expect(a).not.toBe(b)
  })
})

describe('getClientIp', () => {
  it('extracts IP from x-forwarded-for header', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '203.0.113.50, 70.41.3.18' },
    })
    expect(getClientIp(req)).toBe('203.0.113.50')
  })

  it('extracts single IP from x-forwarded-for', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '203.0.113.50' },
    })
    expect(getClientIp(req)).toBe('203.0.113.50')
  })

  it('falls back to x-real-ip', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-real-ip': '10.0.0.1' },
    })
    expect(getClientIp(req)).toBe('10.0.0.1')
  })

  it('returns unknown when no IP headers present', () => {
    const req = new Request('http://localhost')
    expect(getClientIp(req)).toBe('unknown')
  })
})

describe('getCountry', () => {
  it('reads x-vercel-ip-country header', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-vercel-ip-country': 'US' },
    })
    expect(getCountry(req)).toBe('US')
  })

  it('returns Unknown when header is missing', () => {
    const req = new Request('http://localhost')
    expect(getCountry(req)).toBe('Unknown')
  })
})
