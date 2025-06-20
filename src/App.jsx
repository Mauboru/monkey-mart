import { GameCanvas } from './components/GameCanvas';

export default function App() {
  const assetPaths = {
    backgroundImg: './background.png',
    playerImg: './player.png',
    boxImg: './box.png',
    generatorImg: './generator.png',
    itemImg: './item.png',
    spotImage: './spot.png',
    paymentBoxImage: './paymentBox.png',
    moneyImg: './money.png',
    clientImg: './client.png',
    cashierImg: './cashier.png',
    stockerImg: './stocker.png',
    configButtonIcon: './engrenagem.png',
    cartButtonIcon: './cart.png',
    hatButtonIcon: './hat.png',
    upgradeButtonIcon: './upgrade.png',
    dailyButtonIcon: './daily.png',
    adsButtonIcon: './ads.png',
    garbageImg: './garbage.png'
  };

  return <GameCanvas assetPaths={assetPaths} />;
}