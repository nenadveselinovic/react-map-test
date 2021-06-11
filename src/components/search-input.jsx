import React, { useEffect, useRef } from 'react';

import './search-input.scss';

const SearchInput = ({id, google, map, label, placeListener}) => {

  const inputEl = useRef(null);

  useEffect(() => {
    renderAutoComplete(inputEl.current);
  }, []);

  const renderAutoComplete = (input) => {
    console.log('auto', google, map)
    if (!google || !map) return;

    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (!place.geometry) return;

      if (placeListener) {
        placeListener(id, place);
      }
    });
  }

  return (
    <div
      className="addressField sc-rBLzX bfFyKJ kirk-searchForm-overlay-transition-exit kirk-searchForm-overlay-transition-exit-active"
      onBlur={() => placeListener(id, null)}>
      <div role="combobox" className="sc-fONwsr fGdgSP kirk-autoComplete addressField-autoComplete">
        <div className="sc-cIShpX jUTZMG kirk-textField addressField-searchBox">
          <div className="kirk-textField-wrapper">
            <div className="kirk-autoComplete-icon">
              <div className="sc-dnqmqq fzalHo kirk-bullet kirk-bullet--search" aria-hidden="true"></div>
            </div>
            <input type="search" autoFocus placeholder={label} name={id} autoComplete="off" autoCorrect="off" ref={inputEl} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchInput;
