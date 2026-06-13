interface CardCarrosselProps {
  asset: string;
  borderColor?: string;
  width?: number;
  height?: number;
}

export default function CardCarrossel({
  width = 378,
  height = 392,
  asset,
  borderColor = '#FFA400',
}: CardCarrosselProps) {
  return (
    <>
      <section
        className="rounded-[20px] overflow-hidden shrink-0"
        style={{
          width,
          height,
          border: `3px solid ${borderColor}`,
        }}
      >
        <img
          src={asset}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </section>
    </>
  );
}
