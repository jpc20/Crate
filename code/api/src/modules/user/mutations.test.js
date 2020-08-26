import request from 'supertest'
import express from 'express'
import graphqlHTTP from 'express-graphql'
import schema from '../../setup/schema'

describe('user mutations', () => {
  let server;

  beforeAll(() => {
    server = express();

    server.use(
      '/',
      graphqlHTTP({
        schema: schema,
        graphiql: false,
      })
    )
  })

  it('userSignup', async () => {
    const response = await request(server)
      .post('/')
      .send({ query: 'mutation { userSignup(name: "test", email: "test3", password: "test") { id name email } }'})
      .expect(200)
      expect(response.body.data.userSignup.email).toEqual('test3')

      const id = response.body.data.userSignup.id;

      await request(server)
        .post('/')
        .send({ query: `mutation { userRemove(id: ${id}) { id name email } }`})
        .expect(200)
  })

  it('addStyleToUser', async () => {
      const survey = { classy: 5, artsy: 2, punk: 7, sporty: 6, natureesque: 3 };
      const resp = await request(server)
        .get('/')
        .send({ query: '{ userLogin(email: "user@crate.com", password: "123456", role: "USER") { user { name } } }' })
        .expect(200)

      const response = await request(server)
        .post('/')
        .send({ query: `mutation { addStyleToUser(survey: ${survey}) { id name email style } }`})
        .expect(200)

        expect(response.body.data.addStyleToUser.style).toEqual('punk')
  })
})