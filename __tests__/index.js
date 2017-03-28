/* eslint-env jest */

const npoApiInterceptor = require('../lib/npoapiinterceptor.cjs')

describe('Interceptor factory', () => {
  it('should throw if key or secret is not supplied', () => {
    expect(() => {
      npoApiInterceptor({})
    }).toThrowError()
  })

  it('should return a function', () => {
    expect(npoApiInterceptor({
      key: 'a',
      secret: 'b'
    })).toBeInstanceOf(Function)
  })
})

describe('Interceptor', () => {
  let interceptor

  beforeEach(() => {
    interceptor = npoApiInterceptor({
      key: 'a',
      secret: 'b',
      origin: 'c'
    })
  })

  it('should only intercept requests to the NPO API', () => {
    const result = interceptor({ url: 'https://www.example.com' })

    expect(result).toEqual({ url: 'https://www.example.com' })
    expect(result).not.toHaveProperty('headers')
  })

  it('should return a Promise', () => {
    const result = interceptor({ url: 'https://rs.poms.omroep.nl/v1/api/media' })

    expect(result).toBeInstanceOf(Promise)
  })

  it('should add headers to the given config', () => {
    return interceptor({
      url: 'https://rs.poms.omroep.nl/v1/api/media'
    }).then(config => {
      expect(config).toHaveProperty('headers')
      expect(config.headers['Content-Type']).toEqual('application/json')
      expect(config.headers.Accept).toEqual('application/json')
    })
  })

  it('should set the right X-NPO-Date header', () => {
    const date = new Date(2017, 2, 1, 0, 0, 0, 0)

    return interceptor({
      url: 'https://rs.poms.omroep.nl/v1/api/media',
      date: date
    }).then(config => {
      expect(config.headers).toHaveProperty('X-NPO-Date')
      expect(config.headers['X-NPO-Date']).toBe(date.toUTCString())
    })
  })

  it('should calculate the right Authorization header', () => {
    const date = new Date(2017, 2, 1, 0, 0, 0, 0)

    return interceptor({
      url: 'https://rs.poms.omroep.nl/v1/api/media',
      date: date
    }).then(config => {
      expect(config.headers).toHaveProperty('Authorization')
      expect(config.headers.Authorization).toEqual('NPO a:nfHqRlxjOYwle2bEtK72x5b11XJPblXlebpgbKW+pEk=')
    })
  })

  it('should set the given Origin header in non-browser environments', () => {
    return interceptor({
      url: 'https://rs.poms.omroep.nl/v1/api/media'
    }).then(config => {
      expect(config.headers).toHaveProperty('Origin')
      expect(config.headers.Origin).toEqual('c')
    })
  })
})
