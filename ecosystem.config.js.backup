module.exports = {
  apps: [
    {
      name: 'payload-app',
      script: './.next/standalone/server.js',
      cwd: '/opt/payload-app',

      // Maximum performance with standalone
      instances: 'max',
      exec_mode: 'cluster',

      // Optimized for standalone mode
      node_args: ['--max-old-space-size=1536', '--optimize-for-size'],

      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },

      min_uptime: '5s',
      max_restarts: 3,
      autorestart: true,
      watch: false,

      // Fast logging
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      merge_logs: true,

      listen_timeout: 3000,
      kill_timeout: 2000,
    },
  ],
}
