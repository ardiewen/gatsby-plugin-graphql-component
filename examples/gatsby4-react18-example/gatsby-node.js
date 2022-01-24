const { registerComponent, createResolverField } = require("gatsby-plugin-graphql-component")

exports.createPages = async ({ actions }) => {
  const { createPage } = actions
  createPage({
    path: "/using-dsg",
    component: require.resolve("./src/templates/using-dsg.js"),
    context: {},
    defer: true,
  })
}

let id = null

exports.sourceNodes = async () => {
  id = await registerComponent({
    component: require.resolve("./src/components/test"),
  })
}

exports.createResolvers = async ({ createResolvers }) => {
  const resolvers = {
    Query: {
      Test: createResolverField({ resolve: async (source, args, context, info) => id }),
    },
  }

  createResolvers(resolvers)
}
