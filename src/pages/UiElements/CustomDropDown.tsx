import { useEffect, useState } from 'react';
import { cn } from '../../js/cn';

type Option = {
  label: string;
  value: string;
};

type Props = {
  container?: string;
  placeholder?: string;
  placeholderClass?: string;
  selectedOptionClass?: string;
  selectedOptionContainerClass?: string;
  searchOptionInputClass?: string;
  searchOptionInputContainerClass?: string;
  menuListContainerClass?: string;
  optionsContainerClass?: string;
  searchPlaceholder?: string;
  options: Option[];
  id?: string;
  handleSelect: (option: Option) => void;
};

const CustomDropDown = (
  {
    container,
    placeholder,
    placeholderClass,
    selectedOptionClass,
    selectedOptionContainerClass,
    searchOptionInputClass,
    searchOptionInputContainerClass,
    menuListContainerClass,
    optionsContainerClass,
    searchPlaceholder,
    options,
    id,
    handleSelect,
  }: Props,
) => {
  const [_options, _setOptions] = useState<Option[]>([]);

  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  return (
    <div className={cn('relative min-w-47.5', container)}>
      <div
        id={id}
        className={cn(
          'rounded-md border-2 border-slate-300 bg-transparent px-2 py-[4.5px] dark:border-slate-600 dark:bg-slate-900',
          selectedOptionContainerClass,
        )}
      >
        {selectedOption ? (
          <span className={cn('', selectedOptionClass)}>
            {selectedOption.label}
          </span>
        ) : (
          <span className={cn('', placeholderClass)}>
            {placeholder ?? 'Select an option'}
          </span>
        )}
      </div>
      <div
        className={cn(
          'absolute z-10 mt-2 flex w-full flex-col gap-2 rounded-md border-2 border-slate-300 bg-white p-1 dark:border-slate-600 dark:bg-slate-900',
          menuListContainerClass,
        )}
      >
        <div className={cn('p-1 ', searchOptionInputContainerClass)}>
          <input
            type="text"
            placeholder={searchPlaceholder ?? 'Search...'}
            className={cn(
              'w-full rounded bg-slate-100 p-1 px-2 text-xs dark:bg-slate-800',
              searchOptionInputClass,
            )}
          />
        </div>
        <div className={cn('', optionsContainerClass)}>
          {options?.map((option: Option, index: number, array: Option[]) => (
            <button
              type="button"
              key={option.value}
              onClick={() => {
                setSelectedOption(option);
                handleSelect(option);
              }}
              className={cn(
                'block w-full list-none rounded p-1 px-2 text-start hover:bg-slate-100',
              )}
            >
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomDropDown;
