// export default (value) => {
//   const date = new Date(value)
//   const YY = date.getFullYear()
//   const MM = date.getMonth()
//   const DD = date.getDate()
//   const hh = date.getHours()
//   const mm = date.getMinutes()
//   const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
//   console.log(DD + '. ' + months[MM] + ' ' + YY + '. ' + hh + ':' + mm)
//   return date.toString(DD + '. ' + months[MM] + ' ' + YY + '. ' + hh + ':' + mm)
// }

// method not working with all browsers and versions, only for the latest for now
export default (value) => {
  const date = new Date(value)
  return date.toLocaleString(['en-US'], {month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minutes: '2-digit'})
}
