import Docker from 'dockerode';
// for windows
// export default new Docker({ socketPath: '//var/run/docker.sock' });
// for linux
export default new Docker({ socketPath: '/var/run/docker.sock' });