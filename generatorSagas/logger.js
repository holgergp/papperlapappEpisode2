const logEffect = (effect) => {
    let effectInfo;
    switch (effect.type) {
      case "fork":
        effectInfo = effect.saga.name;
        break;
      case "take":
        effectInfo = effect.actionType;
        break;
      case "select":
        effectInfo = effect.selector.name;
        break;
      case "call":
        effectInfo = effect.method.name;
        break;
      case "put":
        effectInfo = `${effect.action.type} ${JSON.stringify(
          effect.action.payload
        )}`;
        break;
      default:
        break;
    }
    console.log(
      `%ceffect: %c${effect.type}%c ${effectInfo}`,
      "color: gray",
      "color: green; font-weight: bold",
      "color: white"
    );
  };
  



module.exports = {logEffect} 