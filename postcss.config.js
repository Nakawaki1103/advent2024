module.exports = {
  content: [
    './*.html',
    './src/**/*.{js,ts}', // src内にJSファイルなどがある場合
  ],
  theme: {
    extend: {},
  },
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
