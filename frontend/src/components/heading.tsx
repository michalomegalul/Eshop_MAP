interface NavProps {
    text: string;
}

function heading(props: NavProps) {
  return (
    <h3 className='text-[#0F0001] text-[24px] font-bold leading-[30px] flex justify-center'>
      {props.text}
    </h3>
  )
}

export default heading