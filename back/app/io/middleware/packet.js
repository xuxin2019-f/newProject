module.exports = (app) => {
  return function* (next) {
    this.socket.emit('res', this.packet[0])
    console.log('packet:', this.packet)
    yield* next
  }
}
