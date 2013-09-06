  var engine = {

      domain: null,
      errors: [],
      searchfield: '#domainfield',
      ajaxRequest: null,

      handlers: {
          message: $('#flash-message'),
          error: $('#flash-message')
      },

      messages: {
          noStringProvided: 'No Domain was provided.',
          invalidDomainFormation: 'Invalid Domain: ',
          errorContactingServer: 'Error Contacting Server',
          loadingElement: 'Loading..' // Can also be html.
      },

      handler: function () {
          domain = $(engine.searchfield).val(),
          engine.domain = domain,
          engine.checker(domain);
          engine.showErrors();
      },


      displayResults: function (json) {
          var message = engine.handlers.message;
          var results = json.results;

          message.html('<ol><ol>');

          $.each(results, function (index, value) {
              if (-1 == $.inArray(value.availability, ["tld", "unavailable"])) {
                  message.append("<li id=" + value.availability + ">" + value.subdomain + value.path + " <span>" + value.availability + "</span></li>");
              }
          });

      },

      getResults: function (json) {

          var results = [];
          $.each(json.results, function (index, value) {
              if (-1 == $.inArray(value.availability, ["tld", "unavailable"])) {
                  results.push(value);
              }
          });
          return results;
      },

      checker: function (domain) {


          if (engine.ajaxRequest) {
              engine.ajaxRequest.abort();
          }

          if (domain === "") {
              engine.errors.push(engine.messages.noStringProvided);
              return false;
          }

          /*  Only Domains
      if(!/^[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/.test(domain)){ 
        engine.errors.push(engine.messages.invalidDomainFormation+domain);
        return false;
      } */


          engine.ajaxRequest = $.ajax({
              type: 'GET',
              dataType: "jsonp",
              contentType: "application/json",
              url: "https://domai.nr/api/json/search?q=" + domain,

              success: function (json) {

                  engine.displayResults(json);
              },

              error: function (responseData, textStatus, errorThrown) {
                  engine.handlers.error.html('<span>' + engine.messages.errorContactingServer + '</span>');
              }

          });



          engine.handlers.message.html(engine.messages.loadingElement);


      },

      showErrors: function () {

          if (engine.errors.length) {
              engine.handlers.error.html('');
              $.each(engine.errors, function () {
                  engine.handlers.error.append('<li>' + this + '</li>');
              });
          }
          engine.errors = [];
      }


  };

  $('#domainfield').on('keyup', $.proxy(engine, 'handler'));
