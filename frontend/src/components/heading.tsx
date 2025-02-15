interface NavProps {
    text: string;
}

function heading(props: NavProps) {
  return (
    <h3 className='text-[#0F0001] text-[32px] font-bold leading-[30px] flex justify-center my-10 dark:text-textdark'>
      {props.text}
    </h3>
  )
}

export default heading