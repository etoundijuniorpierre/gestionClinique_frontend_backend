import Styled from 'styled-components'
import { useState, useEffect, useRef } from 'react'
import iconrecherche from '../assets/iconrecherche.png'
import iconburger from '../assets/iconburger.png'

const RechercheContainer = Styled.div`
   position: relative;
   width: 75%;
`

const RechercheStyle = Styled.div`
   width: 100%;
   height: 56px;
   border-radius: 28px;
   background-color: rgba(239, 239, 255, 1);
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding-left: 20px;
   padding-right: 20px;
   transition: all 0.3s ease;
   border: 2px solid transparent;
   
   &:focus-within {
       border-color: rgba(159, 159, 255, 1);
       box-shadow: 0 0 0 3px rgba(159, 159, 255, 0.1);
   }
`

const IconburgerStyle = Styled.img`
    width: 24px;
    height: 20px;
    cursor: pointer;
    transition: transform 0.2s ease;
    
    &:hover {
        transform: scale(1.1);
    }
`

const IconrechercheStyle = Styled.img`
    width: 20px;
    height: 20px;
    cursor: pointer;
    transition: transform 0.2s ease;
    
    &:hover {
        transform: scale(1.1);
    }
`

const InputStyle = Styled.input`
    width: 90%;
    height: 56px;
    border: none;
    background-color: rgba(239, 239, 255, 1);
    font-family: "Inter", sans-serif;
    font-weight: 400;
    font-size: 1em;
    outline: none;
    
    &::placeholder {
        color: #999;
        transition: color 0.3s ease;
    }
    
    &:focus::placeholder {
        color: #666;
    }
`

const SuggestionsContainer = Styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    margin-top: 8px;
    max-height: 300px;
    overflow-y: auto;
    z-index: 1000;
    display: ${props => props.show ? 'block' : 'none'};
`

const SuggestionItem = Styled.div`
    padding: 12px 20px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    border-bottom: 1px solid #f0f0f0;
    
    &:hover {
        background-color: rgba(159, 159, 255, 0.1);
    }
    
    &:last-child {
        border-bottom: none;
    }
    
    &.highlighted {
        background-color: rgba(159, 159, 255, 0.2);
    }
`

const NoResults = Styled.div`
    padding: 20px;
    text-align: center;
    color: #666;
    font-style: italic;
`

const ClearButton = Styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 50%;
    transition: background-color 0.2s ease;
    
    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }
`

function Recherche({ 
    placeholder = 'Rechercher...', 
    onSearch, 
    suggestions = [], 
    onSuggestionSelect,
    showSuggestions = true,
    ...props 
}){
    const [query, setQuery] = useState('');
    const [showSuggestionsList, setShowSuggestionsList] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);

    useEffect(() => {
        if (query.length > 0 && showSuggestions) {
            setShowSuggestionsList(true);
        } else {
            setShowSuggestionsList(false);
        }
        setHighlightedIndex(-1);
    }, [query, showSuggestions]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setShowSuggestionsList(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        onSearch && onSearch(value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex(prev => 
                prev < suggestions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
                handleSuggestionSelect(suggestions[highlightedIndex]);
            } else {
                onSearch && onSearch(query);
            }
        } else if (e.key === 'Escape') {
            setShowSuggestionsList(false);
            inputRef.current?.blur();
        }
    };

    const handleSuggestionSelect = (suggestion) => {
        setQuery(suggestion);
        setShowSuggestionsList(false);
        onSuggestionSelect && onSuggestionSelect(suggestion);
        inputRef.current?.blur();
    };

    const handleClear = () => {
        setQuery('');
        onSearch && onSearch('');
        inputRef.current?.focus();
    };

    const handleSearch = () => {
        onSearch && onSearch(query);
    };

    return(
        <RechercheContainer ref={suggestionsRef}>
            <RechercheStyle>
                <IconburgerStyle src={iconburger} alt="Menu" />
                <InputStyle 
                    ref={inputRef}
                    type="text" 
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    {...props}
                />
                {query && (
                    <ClearButton onClick={handleClear} title="Effacer">
                        ✕
                    </ClearButton>
                )}
                <IconrechercheStyle 
                    src={iconrecherche} 
                    alt="Rechercher"
                    onClick={handleSearch}
                    title="Rechercher"
                />
            </RechercheStyle>
            
            <SuggestionsContainer show={showSuggestionsList && suggestions.length > 0}>
                {suggestions.map((suggestion, index) => (
                    <SuggestionItem
                        key={index}
                        className={index === highlightedIndex ? 'highlighted' : ''}
                        onClick={() => handleSuggestionSelect(suggestion)}
                    >
                        {suggestion}
                    </SuggestionItem>
                ))}
                {suggestions.length === 0 && query.length > 0 && (
                    <NoResults>
                        Aucun résultat trouvé
                    </NoResults>
                )}
            </SuggestionsContainer>
        </RechercheContainer>
    )
}

export default Recherche
