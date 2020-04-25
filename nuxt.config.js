export default {

  mode: 'spa',

  render: {
    bundleRenderer: {
      shouldPreload: (file, type) => {
        return ['script', 'style', 'font'].includes(type)
      }
    }
  },

  head: {
    title: 'test-dmaster',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'test-dmaster' }
    ]
  },

  css: [
    '../assets/css/main.less',
    '@fortawesome/fontawesome-svg-core/styles.css',
    'iview/dist/styles/iview.css'
  ],

  plugins: [
    {src: '~/plugins/api', ssr: false},
    {src: '~/plugins/fontawesome', ssr: false},
    {src: '~/plugins/iview', ssr: false},
  ],

  modules: [
    '@nuxtjs/axios'
  ],

  build: {
    extend(config, ctx) {
      ctx.loaders.less.javascriptEnabled = true
    },
    cache: true,
  },

  axios: {
    retry: false,
    baseURL: 'http://localhost:3004/'
  }
}
