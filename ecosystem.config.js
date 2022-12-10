module.exports = {
    apps: [
        {
            name: 'ssd',
            exec_mode: 'cluster',
            instances: 'max', // Or a number of instances
            script: './node_modules/nuxt/bin/nuxt.js',
            args: 'start',
            env: {
                NODE_ENV: "production",
                port: 3000
            }
        }
    ]
}