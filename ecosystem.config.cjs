module.exports = {
  apps: [
    {
      name: 'DbErp',
      port: process.env.PORT,
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}
