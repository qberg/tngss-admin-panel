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
      node_args: ['--max-old-space-size=2048', '--optimize-for-size', '--max-semi-space-size=128'],

      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
        UV_THREADPOOL_SIZE: 16,
      },

      min_uptime: '5s',
      max_restarts: 3,
      restart_delay: 4000,
      autorestart: true,
      watch: false,

      pmx: true,
      instance_var: 'INSTANCE_ID',

      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/var/log/payload-app/err.log',
      out_file: '/var/log/payload-app/out.log',
      log_file: '/var/log/payload-app/combined.log',
      merge_logs: true,

      listen_timeout: 3000,
      kill_timeout: 2000,
      wait_ready: true,
    },
  ],
}
