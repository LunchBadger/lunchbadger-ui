export default (element, block = 'end') => element && element.scrollIntoView({
  block,
  inline: 'nearest',
  behavior: 'smooth',
});
