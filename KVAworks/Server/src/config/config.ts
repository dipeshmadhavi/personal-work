export class config {
  static servergroups = [
    {
      groupname: 'Server Group 1',
      serverport: '8000',
      pathatserver: '/api/monitor1',
      servers: [
        {
          ip: '192.168.12.23',
        },
        {
          ip: '68.23.124.225',
        },
      ],
    },
    {
      groupname: 'Server Group 2',
      serverport: '9000',
      pathatserver: '/api/monitor2',
      servers: [
        {
          ip: '192.168.12.24',
        },
        {
          ip: '68.23.124.226',
        },
      ],
    },
  ];
}
