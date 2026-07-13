// postcss.config.js
module.exports = {
    plugins: [
      require('@tailwindcss/postcss')({
        content: [
          './templates/**/*.twig',
          './assets/**/*.{js,jsx,ts,tsx}'
        ]
      }),
    ],
  };