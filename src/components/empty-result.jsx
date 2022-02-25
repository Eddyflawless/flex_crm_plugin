const EmptyResult = (props) => {
    return (
      <div className={'empty-div'}>
          <img src="" />
          <h3 class="mg-t-20">{props.title? props.title : "No results to show"}</h3>
      </div>
    )
  }
  
  
  export default EmptyResult;