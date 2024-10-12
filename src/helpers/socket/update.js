const updateFront = () => {
    io.emit("updateFront", true);
  };

module.exports = updateFront;