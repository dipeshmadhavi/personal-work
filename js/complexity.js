function getResolution(device) {
  if('mobile') {
    return 320
  } else if('tab') {
    return 720
  } else if('web') {
    return 1024
  }
}