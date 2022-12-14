// Microbundle uses its own Babel config, so we need to make sure we use this only for tests
module.exports =
    process.env.NODE_ENV === 'test'
        ? {
              presets: [
                  [
                      '@babel/preset-env',
                      {
                          targets: {
                              node: 'current',
                          },
                      },
                  ],
                  '@babel/preset-typescript',
              ],
              plugins: [
                  [
                      '@babel/plugin-transform-runtime',
                      {
                          regenerator: true,
                      },
                  ],
              ],
          }
        : {};
