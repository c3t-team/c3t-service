const handleError = (error) => {
  if(typeof error === 'string') {
    return {
      status: 0,
      message: error,
      payload : ''
    }
  }
  if(error && error.message) {
    return {
      status: 0,
      message: error.message.toString(),
      payload: error
    }
  }
  if(error.error && error.error.message) {
    return {
      status: 0,
      message: error.error.message.toString(),
      payload: error
    }
  }

  // todo
}

module.exports = {handleError}