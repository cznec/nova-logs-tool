const mix = require('laravel-mix')
const webpack = require('webpack')
const path = require('path')

class NovaExtension {
  name() {
    return 'nova-extension'
  }

  register(name) {
    this.name = name
  }

  webpackConfig(webpackConfig) {
    webpackConfig.externals = {
      vue: 'Vue',
      'LaravelNova': 'LaravelNova'
    }

    webpackConfig.resolve.alias = {
      ...(webpackConfig.resolve.alias || {}),
      'laravel-nova': path.join(
        __dirname,
        '../../vendor/laravel/nova/resources/js/mixins/packages.js'
      ),
      'laravel-nova-ui': path.join(__dirname, '../../vendor/laravel/nova/node_modules/laravel-nova-ui'),
      '@': path.join(__dirname, '../../vendor/laravel/nova/resources/js/'),
      '@ui': path.join(__dirname, '../../vendor/laravel/nova/resources/ui/'),
    }

    webpackConfig.resolve.extensions = [
      ...(webpackConfig.resolve.extensions || []),
      '.ts',
      '.tsx',
    ]

    webpackConfig.module.rules.push({
      test: /\.tsx?$/,
      loader: 'ts-loader',
      exclude: /node_modules/,
      options: {
        appendTsSuffixTo: [/\.vue$/],
        transpileOnly: true,
      },
    })

    webpackConfig.output = {
      uniqueName: this.name,
    }
  }

  webpackPlugins() {
    return [
      {
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap('NovaManifest', () => {
            const fs = require('fs')
            const manifestPath = path.join(__dirname, 'mix-manifest.json')
            const manifest = {
              "/js/tool.js": "/js/tool.js",
              "/css/tool.css": "/css/tool.css"
            }
            fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
          })
        }
      }
    ]
  }
}

mix.extend('nova', new NovaExtension())