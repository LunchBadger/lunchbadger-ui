export default element => element && element.scrollIntoView({
  block: 'end',
  inline: 'nearest',
  behavior: 'smooth',
});
