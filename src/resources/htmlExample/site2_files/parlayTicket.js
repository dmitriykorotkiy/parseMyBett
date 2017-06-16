var PSPARLAYTICKET = (function (parlayTicketModule, $) {
    var ticketContainer;
    parlayTicketModule.initialize = function () {
        ticketContainer = $("#parlayTicketContainer");
        ticketContainer.on('click', 'a.pt_close', function () { parlayTicketModule.removeLeg($(this)); return false; });
        ticketContainer.on('click', 'a#pt_selectAll', function () { parlayTicketModule.selectAll(); parlayTicketModule.calculateMaxPayout(); parlayTicketModule.hideUnhideOdds(); return false; });
        ticketContainer.on('click', 'a#pt_deselectAll', function () { parlayTicketModule.deselectAll(); parlayTicketModule.calculateMaxPayout(); parlayTicketModule.hideUnhideOdds(); return false; });
        ticketContainer.on('click', '.pt_multibetoptions input[type="checkbox"]', function () { parlayTicketModule.changeLink(); parlayTicketModule.hideUnhideOdds(); parlayTicketModule.calculateMaxPayout(); });
        ticketContainer.on('keydown', '#pt_riskAmount', function (event) { parlayTicketModule.allowOnlyValidCharacters(event); });
        ticketContainer.on('keyup', '#pt_riskAmount', function () { parlayTicketModule.calculateMaxPayout(); });
        ticketContainer.on('blur', '#pt_riskAmount', function () { parlayTicketModule.formatStake(); parlayTicketModule.calculateMaxPayout(); });
        ticketContainer.on('click', '.pt_submit A, .pt_submit .ui-btn', function () {
            var ticketSource = ticketContainer.find("#pt_source").val();
            if (ticketSource == "TestDrive") {
                var riskAmount = ticketContainer.find('#pt_riskAmount');
                var parsedRiskAmount = parseFloat(riskAmount.val().replace(",", ""));
                if (isNaN(parsedRiskAmount) || parsedRiskAmount == '' || parsedRiskAmount == 0) {
                    var stakeEmptyMessage = ticketContainer.find('#pt_stakeEmptyMessage').val();
                    alert(stakeEmptyMessage);
                    return false;
                } else {
                    $("#pt_submitForm").submit();
                    return true;
                }

            } else {
                parlayTicketModule.submitTicket();
                return false;
            }
        });
        ticketContainer.on('submit', '#pt_submitForm', function () {
            var ticketSource = ticketContainer.find("#pt_source").val();
            if (ticketSource == "TestDrive") {
                return true;
            } else {
                parlayTicketModule.submitTicket();
                return false;
            }
        });
        ticketContainer.on('change', '#ParlayTicketModel_AcceptBetterLines', function () { parlayTicketModule.saveAcceptBetterLines($(this)); return false; });
    };
    parlayTicketModule.load = function () {
        if (!window.location.hash || window.location.hash.indexOf('&line=/Bet/Add/') == -1) {
            ticketContainer.removeClass('hidden');
            var source = ticketContainer.find("#pt_source").val();
            if (source == "Asia") LINES.utils.showLoadingDiv(ticketContainer, "medium", "center", true);
            $.ajax({
                type: "GET",
                url: LINES.config.virtualDirectory + "ParlayTicket",
                success: function (result) {
                    if (result === '') {
                        $("#emptyBetTicket").removeClass('hidden');
                    } else {
                        $("#emptyBetTicket").addClass('hidden');
                        $("#ticketWagers").addClass('hidden');
                        ticketContainer.html(result);
                    }

                    if (source == "Asia") LINES.utils.hideLoadingDiv("parlayTicketContainer");
                },
                dataType: 'text'
            });
        }
    };
    parlayTicketModule.clear = function () {
        if (ticketContainer.html() != '') {
            $.ajax({
                type: "POST",
                url: LINES.config.virtualDirectory + "ParlayTicket/Clear",
                dataType: 'text',
                success: function () { ticketContainer.html(''); }
            });
        }
    };
    parlayTicketModule.addLeg = function (href) {
        var ticketWagers = $("#ticketWagers");
        if (!ticketWagers.hasClass('hidden')) {
            ticketWagers.addClass('hidden');
            ticketContainer.addClass('hidden');
            $("#emptyBetTicket").removeClass('hidden');
        }
        //var source = ticketContainer.find("#pt_source").val();
        //if (source == "Asia") LINES.utils.showLoadingDiv(ticketContainer, "medium", "center", true);
        var numberofLegs = ticketContainer.find(".pt_leg").length;
        var maximumNumberOfLegs = ticketContainer.find("#pt_maximumNumberOfLegs").val();
        if (numberofLegs >= maximumNumberOfLegs) {
            var numberOfLegsAboveMaximumMessage = ticketContainer.find('#pt_numberOfLegsAboveMaximumMessage').val();
            alert(numberOfLegsAboveMaximumMessage);
        } else {
            var emptyBetTicket = $("#emptyBetTicket");
            if (!emptyBetTicket.hasClass('hidden')) {
                LINES.utils.showLoadingDiv(emptyBetTicket, "medium", "center", true);
            } else {
                LINES.utils.showLoadingDiv(ticketContainer, "medium", "center", true);
            }
            $.ajax({
                type: "POST",
                url: href,
                success: function (result) {
                    ticketContainer.html(result);
                    if (ticketContainer.find('.pt').length != 0) {
                        $("#emptyBetTicket").addClass('hidden');
                        ticketContainer.removeClass('hidden');
                    }
                    LINES.utils.hideLoadingDiv("emptyBetTicket");
                    LINES.utils.hideLoadingDiv("parlayTicketContainer");

                    var overlayMessage = ticketContainer.find(".pt_overlayMessage .messagetext");
                    if (overlayMessage.length) {
                        var isAlert = ticketContainer.find("#pt_isAlert").val();
                        if (isAlert == 'True') {
                            alert(overlayMessage.html());
                        } else {
                            emptyBetTicket.find(".message").html(overlayMessage.html());
                            emptyBetTicket.removeClass('hidden');
                            ticketContainer.addClass('hidden');
                            ticketContainer.html('');
                        }
                    }
                },
                dataType: 'text'
            });
        }
    };
    parlayTicketModule.removeLeg = function (element) {
        var source = ticketContainer.find("#pt_source").val();
        if (source == "Asia") {
            var leg = element.parent();
            leg.slideUp("slow", function () {
                leg.next().hide();
                LINES.utils.showLoadingDiv(ticketContainer, "medium", "center", true);
                $.ajax({
                    type: "GET",
                    url: element.attr("href"),
                    success: function (result) {
                        if (result === '') {
                            var emptyBetTicket = $("#emptyBetTicket");
                            emptyBetTicket.removeClass('hidden');
                            emptyBetTicket.find(".message").html(LINES.state.translationsStore["BetTicketNote2"]);
                        }
                        ticketContainer.html(result);
                        LINES.utils.hideLoadingDiv("parlayTicketContainer");
                    },
                    dataType: 'text'
                });
            });

        }
    };
    parlayTicketModule.submitTicket = function () {
        var source = ticketContainer.find("#pt_source").val();
        if (source == "Asia" || source == "Mobile") {
            if (!ticketContainer.find('.pt_submit').hasClass('disabled')) {
                var riskAmount = ticketContainer.find('#pt_riskAmount');
                var parsedRiskAmount = parseFloat(riskAmount.val().replace(",", ""));
                var minimumRiskLimit = parseFloat(ticketContainer.find('#pt_minimumRiskLimit').val());
                var maximumRiskLimit = parseFloat(ticketContainer.find('#pt_maximumRiskLimit').val());
                var numberOfLegs = parseInt(ticketContainer.find('#pt_numberOfLegs').val());
                var minimumNumberOfLegs = parseInt(ticketContainer.find('#pt_minimumNumberOfLegs').val());
                if (isNaN(parsedRiskAmount) || parsedRiskAmount == '' || parsedRiskAmount == 0) {
                    var stakeEmptyMessage = ticketContainer.find('#pt_stakeEmptyMessage').val();
                    alert(stakeEmptyMessage);
                } else if (parsedRiskAmount < minimumRiskLimit) {
                    var stakeAmountBelowMinimumMessage = ticketContainer.find('#pt_stakeAmountBelowMinimumMessage').val();
                    riskAmount.val(minimumRiskLimit);
                    parlayTicketModule.formatStake();
                    parlayTicketModule.calculateMaxPayout();
                    alert(stakeAmountBelowMinimumMessage);
                } else if (parsedRiskAmount > maximumRiskLimit) {
                    var stakeAmountAboveMaximumMessage = ticketContainer.find('#pt_stakeAmountAboveMaximumMessage').val();
                    riskAmount.val(maximumRiskLimit);
                    parlayTicketModule.formatStake();
                    parlayTicketModule.calculateMaxPayout();
                    alert(stakeAmountAboveMaximumMessage);
                } else if (numberOfLegs < minimumNumberOfLegs) {
                    var minimumNumberOfLegsmMessage = ticketContainer.find('#pt_numberOfLegsBelowMinimumMessage').val();
                    alert(minimumNumberOfLegsmMessage);
                } else {
                    var acceptanceMessage = parlayTicketModule.updateTotalRisk();
                    if (confirm(acceptanceMessage)) {

                        if (source == "Asia") LINES.utils.showLoadingDiv(ticketContainer, "medium", "center", true);
                        if (source == "Mobile") MOBILE.utils.showPageLoading();
                        var form = ticketContainer.find(".pt  FORM");
                        $.ajax({
                            type: form.prop('method'),
                            url: form.prop('action'),
                            data: form.serialize(),
                            dataType: 'text',
                            success: function (result) {
                                if (source === "Mobile") {
                                    ticketContainer.html(result).enhanceWithin();
                                } else {
                                    ticketContainer.html(result);
                                }
                                if (source == "Asia") LINES.utils.hideLoadingDiv("parlayTicketContainer");
                                if (source == "Mobile") MOBILE.utils.hidePageLoading();
                                var overlayMessage = ticketContainer.find(".pt_overlayMessage .messagetext");
                                if ((source == "Asia" || source == "Mobile") && overlayMessage.length) {
                                    var isAlert = ticketContainer.find("#pt_isAlert").val();
                                    var emptyBetTicket = $("#emptyBetTicket");
                                    if (isAlert == 'True' ) {
                                        if (ticketContainer.find(".pt_overlayMessage").hasClass('Accepted')) {
                                            if (source == "Mobile") {
                                                ticketCart.hide();
                                                $('.show-betslip').addClass('hidden', 100);
                                                alert(overlayMessage.html());
                                                $(location).attr('href', LINES.config.virtualDirectory + "Mobile/BetList/Running");
                                            } else {
                                                emptyBetTicket.removeClass('hidden');
                                                alert(overlayMessage.html());
                                                LINES.helpers.tabs.selectTab(LINES.enums.tab.Wager);
                                            }
                                        } else {
                                            if (source == "Mobile") { TicketCart.enableTab('parlay'); }
                                            alert(overlayMessage.html());
                                        }
                                    } else {                                       
                                        emptyBetTicket.find(".message").html(overlayMessage.html());
                                        emptyBetTicket.removeClass('hidden');
                                        ticketContainer.addClass('hidden');
                                        ticketContainer.html('');
                                    }
                                }
                            }
                        });
                    }
                }
            }
        }
    };
    parlayTicketModule.updateTotalRisk = function () {
        var riskAmount = ticketContainer.find('#pt_riskAmount').val().replace(/,/g, "");
        parlayTicketModule.calculateTotalBets(); // figure out the total number of bets about to be placed
        var currencyCode = ticketContainer.find('#pt_currencyCode').html();
        var acceptanceMessage = ticketContainer.find('#pt_acceptanceMessage').val();
        var totalRisk = parseFloat(ticketContainer.find("#pt_totalbets").val()) * parseFloat(riskAmount);
        totalRisk = parlayTicketModule.toFixed(totalRisk, 2).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        var maxPayout = parseFloat(ticketContainer.find('#pt_maxPayout').html().replace(/,/g, ""));
        var winAmount = maxPayout - parseFloat(totalRisk.replace(/,/g, ""));
        winAmount = parlayTicketModule.toFixed(winAmount, 2).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        acceptanceMessage = acceptanceMessage.replace('{0}', totalRisk + ' ' + currencyCode);
        acceptanceMessage = acceptanceMessage.replace('{1}', winAmount + ' ' + currencyCode);
        ticketContainer.find('#pt_acceptanceMessageFormatted').val(acceptanceMessage);
        return acceptanceMessage;
    };
    parlayTicketModule.selectAll = function () {
        ticketContainer.find('.pt_multibetoptions input[type="checkbox"]').each(function () {
            var checkBox = $(this);
            checkBox.prop('checked', true);
        });
        ticketContainer.find('#pt_selectAll').addClass("hidden");
        ticketContainer.find('#pt_deselectAll').removeClass("hidden");
        parlayTicketModule.calculateMaxPayout();
    };
    parlayTicketModule.deselectAll = function () {
        ticketContainer.find('.pt_multibetoptions input[type="checkbox"]').each(function (index) {
            if (index != 0) {
                var checkBox = $(this);
                checkBox.prop('checked', false);
            }
        });
        ticketContainer.find('#pt_deselectAll').addClass("hidden");
        ticketContainer.find('#pt_selectAll').removeClass("hidden");
        parlayTicketModule.calculateMaxPayout();
    };
    parlayTicketModule.changeLink = function () {
        var allAreTrue = true;
        ticketContainer.find('.pt_multibetoptions input[type="checkbox"]').each(function () {
            if (!$(this).is(':checked')) {
                allAreTrue = false;
            }
        });
        if (allAreTrue) {
            ticketContainer.find('#pt_selectAll').addClass("hidden");
            ticketContainer.find('#pt_deselectAll').removeClass("hidden");
        } else {
            ticketContainer.find('#pt_deselectAll').addClass("hidden");
            ticketContainer.find('#pt_selectAll').removeClass("hidden");
        }
    };
    parlayTicketModule.calculateMaxPayout = function () {
        var riskAmountVal = ticketContainer.find('#pt_riskAmount').val();
        var riskAmount = 0;
        if (riskAmountVal != '') riskAmount = parseFloat(riskAmountVal.replace(/,/g, ""));
        var totalWin = 0;
        var odds = 0;
        var oddsFormat = "decimal"; // using decimal odds for Parlay calculations
        var checkBoxes = ticketContainer.find('.pt_multibetoptions input[type="checkbox"]');
        var totalRisk = 0;
        checkBoxes.each(function (index) {
            if ($(this).is(':checked')) {
                odds = ticketContainer.find("#pt_roundRobin_" + index).val();
                var numberOfBets = parseFloat(ticketContainer.find("#pt_roundrobin_" + index + "_bets").val());
                totalWin += parseFloat(parlayTicketModule.calculateWinFromRisk(riskAmount, oddsFormat, odds));
                totalRisk += numberOfBets * riskAmount;
            }
        });
        if (totalWin == 0) {
            odds = ticketContainer.find("#pt_roundRobin_0").val();
            totalWin = parseFloat(parlayTicketModule.calculateWinFromRisk(riskAmount, oddsFormat, odds));
            totalRisk = riskAmount;
        }
        var maxPayout = totalWin + totalRisk;
        var result = parlayTicketModule.toFixed(maxPayout, 2).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        if (result != 'NaN') ticketContainer.find('#pt_maxPayout').html(result);
    };
    parlayTicketModule.hideUnhideOdds = function () {
        var checkBoxes = ticketContainer.find('.pt_multibetoptions input[type="checkbox"]');
        var count = 0;
        checkBoxes.each(function (index) {
            if ($(this).is(':checked')) {
                count++;
            }
        });
        var parlayOdds = ticketContainer.find('#pt_parlayOdds');
        if (count > 1 || !checkBoxes[0].checked && count != 0) {
            parlayOdds.addClass('hidden');
        } else {
            parlayOdds.removeClass('hidden');
        }
    };
    parlayTicketModule.toFixed = function (number, precision) {
        var multiplier = Math.pow(10, precision + 1),
			wholeNumber = Math.floor(number * multiplier);
        return Math.round(wholeNumber / 10) * 10 / multiplier;
    };
    parlayTicketModule.allowOnlyValidCharacters = function (event) {
        // Allow only these special characters
        if (event.keyCode == 46 // (delete)
				|| event.keyCode == 8 // (backspace)
				|| event.keyCode == 13 // (enter)
				|| event.keyCode == 110 // .
				|| event.keyCode == 188 // ,
				|| event.keyCode == 190 // .
		) {
            // let it happen, don't do anything
        } else {
            // Ensure that it is a number and stop the keypress
            if ((event.keyCode < 48 || event.keyCode > 57) // outside of 0-9 (aka 48-57)
				&& (event.keyCode < 96 || event.keyCode > 105)) { // outside of 0-9 (aka NUMLOCK 96-105)
                event.preventDefault();
            }
        }
    };
    parlayTicketModule.formatStake = function () {
        var riskAmount = ticketContainer.find('#pt_riskAmount');
        if (riskAmount.val() == '') return;
        var number = parseFloat(riskAmount.val().replace(/,/g, ''));
        
        if (isNaN(number)) {
            riskAmount.val('');
            return;
        }
        var source = ticketContainer.find("#pt_source").val();
        if (source == "Mobile") {
            riskAmount.val(parlayTicketModule.toFixed(number, 2).toFixed(2).replace(/,/g, ''));
        } else {
            riskAmount.val(parlayTicketModule.toFixed(number, 2).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        }
    };
    parlayTicketModule.calculateTotalBets = function () {
        var numberOfBets = 0;
        var checkBoxes = ticketContainer.find('.pt_multibetoptions input[type="checkbox"]');
        checkBoxes.each(function (index) {
            if ($(this).is(':checked')) {
                numberOfBets += parseFloat(ticketContainer.find("#pt_roundrobin_" + index + "_bets").val());
            }
        });
        if (numberOfBets == 0) {
            numberOfBets = 1;
        }
        ticketContainer.find("#pt_totalbets").val(numberOfBets);
        return false;
    };
    parlayTicketModule.calculateWinFromRisk = function (riskAmount, oddsType, price) {
        var winAmount = 0;
        switch (oddsType) {
            case "american":
                if (price < 0) {
                    winAmount = (riskAmount / price * -100);
                }
                else {
                    winAmount = (riskAmount / 100 * price);
                }
                break;
            case "decimal":
                winAmount = riskAmount * (price - 1);
                break;
            case "hongkong":
                winAmount = riskAmount * price;
                break;
            case "malay":
            case "indonesian":
                if (price < 0) {
                    winAmount = riskAmount / -(price);
                }
                else if (price != 0) {
                    winAmount = riskAmount * price;
                }
                break;
            default:
                // Do nothing, if the odds type can't be matched don't calculate the win
        }
        return winAmount.toFixed(4);
    };
    parlayTicketModule.saveAcceptBetterLines = function (element) {
        var source = ticketContainer.find("#pt_source").val();
        if (source == "Asia") {
            var acceptBetterLines = element.prop('checked');

            $.ajax({
                type: "POST",
                url: LINES.config.virtualDirectory + "ParlayTicket/SaveAcceptBetterLines",
                data: "acceptBetterLines=" + acceptBetterLines,
                dataType: 'text',
            });
        }
    };
    return parlayTicketModule;
}(PSPARLAYTICKET || {}, jQuery));

jQueryReady(function () {
    $(document).ready(function () {
        PSPARLAYTICKET.initialize();
    });
});