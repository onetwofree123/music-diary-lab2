interface SearchBarProps {
    value: string
    onSearchChange: (value: string) => void
}

function SearchBar({ value, onSearchChange }: SearchBarProps) {
    return (
        <label className="search-label"> 
        <span>Поиск по трекам</span>
        <input
          className="search-input"
          type="search"
          value={value}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Название, исполнитель или жанр"
          />
        </label>
    )
}

export default SearchBar