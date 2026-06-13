interface CardCarrosselProps {
  asset: string;
  borderColor?: string;
  width?: number;
  height?: number;
}

export default function CardCarrossel({
  width = 398,
  height = 412,
  asset,
  borderColor = '#FFA400',
}: CardCarrosselProps) {
  return (
    <>
      <section
        className="rounded-[20px] overflow-hidden"
        style={{
          width,
          height,
          border: `2px solid ${borderColor}`,
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
