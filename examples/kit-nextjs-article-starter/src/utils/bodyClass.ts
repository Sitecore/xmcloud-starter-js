export const preventScroll = () => {
  document.body.classList.add('overflow-hidden');
};

export const allowScroll = () => {
  document.body.classList.remove('overflow-hidden');
};
