import { nextTestSetup } from 'e2e-utils'
import { fetchViaHTTP } from 'next-test-utils'
import { NEXT_RSC_UNION_QUERY } from 'next/dist/client/components/app-router-headers'

describe('rsc-redirect', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should get 307 status code for document request', async () => {
    const response = await fetchViaHTTP(next.url, '/origin', undefined, {
      redirect: 'manual',
    })
    expect(response.status).toBe(307)
  })

  it('should get 200 status code for rsc request', async () => {
    const response = await fetchViaHTTP(
      next.url,
      `/origin?${NEXT_RSC_UNION_QUERY}`,
      undefined,
      {
        redirect: 'manual',
        headers: {
          RSC: '1',
        },
      }
    )
    expect(response.status).toBe(200)
  })
})
