export const getDateTime = (req, res) => {
  const currentTimeUTC = new Date().toISOString();
  res.send(currentTimeUTC);
};
