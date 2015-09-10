jQuery(document).ready(function () {

            var userId = getParameterByName("userID");
            if (userId.length > 0) {
               
                $("#hidden_userId").val(userId);
            }
            
            function getParameterByName(name) {
                name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
                return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
            }

        });