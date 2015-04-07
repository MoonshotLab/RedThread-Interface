RedThread.controls = {

  // strategyChange   : function
  // viewModelChange  : function
  init : function(opts){

    $('.strategy-input').change(function(){
      var strategy = $('input[name=strategy-type]:checked').val();
      if(opts.strategyChange) opts.strategyChange(strategy);
    });


    // listen for changes to the view model input
    $('.view-model-input').change(function(){
      var viewModel = $('input[name=model-by]:checked').val();
      if(opts.viewModelChange) opts.viewModelChange(viewModel);
    });
  }
};
