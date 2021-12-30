function df(dateStr) {
  var d = new Date(Date.parse(dateStr) + 32400000)
  return d.getUTCFullYear() + "年" + (d.getUTCMonth() + 1) + "月" + d.getUTCDate() + "日"
}

export { df }