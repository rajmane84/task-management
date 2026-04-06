import React from 'react'

const Page = async ({
  params,
}: {
  params: Promise<{ token: string }>
}) => {
   const { token } = await params
  return (
    <div>Board Page for token: {token}</div>
  )
}

export default Page;