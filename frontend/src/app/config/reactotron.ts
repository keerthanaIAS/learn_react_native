const Reactotron = {
  log: (...args: any[]) => {
    console.log('[Reactotron Web]', ...args);
  },

  display: (data: any) => {
    console.log('[Reactotron Web Display]', data);
  },
};

export default Reactotron;