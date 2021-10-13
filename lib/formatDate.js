module.exports = function (date)  {
  const _date = new Date(date);
  return new Date(
    Date.UTC(_date.getFullYear(), _date.getMonth(), _date.getDate())
  );
};
