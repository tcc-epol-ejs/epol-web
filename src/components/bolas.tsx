interface BolasProps {
  className?: string;
}

function Bolas({ className = "right-[-227.17px] top-[200px]" }: BolasProps) {
  return (
    <div
      className={`absolute w-[456.42px] h-[433px] rotate-[118.19deg] ${className}`}
    >
      <div className="absolute w-[197px] h-[197px] left-[-104.62px] top-[339px] bg-[#8888D3] rounded-full rotate-[118.19deg]"></div>

      <div className="absolute w-[346.2px] h-[315.95px] left-[-162px] top-[470px] bg-[rgba(136,136,211,0.81)] rounded-full rotate-[117.81deg]"></div>

      <div className="absolute w-[140px] h-[140px] left-[149.85px] top-[534.7px] bg-[rgba(136,136,211,0.83)] rounded-full rotate-[118.19deg]"></div>
    </div>
  );
}

export default Bolas;
