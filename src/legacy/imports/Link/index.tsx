import imgImageInspirQSportPlay from "./dc2c784d844a9100a81f85120b19c5a79b601888.png";

function ImageInspirQSportPlay() {
  return (
    <div className="h-[40.008px] relative shrink-0 w-full" data-name="Image (InspirQ Sport Play)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageInspirQSportPlay.src} />
    </div>
  );
}

function Container() {
  return (
    <div className="h-[40px] relative shrink-0 w-[128px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <ImageInspirQSportPlay />
      </div>
    </div>
  );
}

export default function Link() {
  return (
    <div className="content-stretch flex items-center relative size-full" data-name="Link">
      <Container />
    </div>
  );
}