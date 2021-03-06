import { Box } from '@material-ui/core';
import SearchBar from 'material-ui-search-bar';
import { UserData as UserDataGR } from './UserData';
import React from 'react';

type setSearchValue = (searchValue: string) => void;

interface SecondUserProps {
    searchValue: string;
    setSearchValue: (searchValue: string) => void;
    handleSearch: (searchValue: string, setSearchValue: setSearchValue) => void;
    onSearch: (userName: string, isSecondUser: boolean) => void;
    handleCancel: () => void;
    userLogin: string;
    children: React.ReactNode;
    isSecondUser: boolean;
}

export const SearchedUser = (props: SecondUserProps) => {
    const {
        searchValue,
        setSearchValue,
        handleSearch,
        onSearch,
        handleCancel,
        userLogin,
        children,
        isSecondUser
    } = props;
    return (
        <>
            <Box mt={20}>
                <SearchBar
                    value={searchValue}
                    onChange={value => handleSearch(value, setSearchValue)}
                    onRequestSearch={() => onSearch(searchValue, isSecondUser)}
                    cancelOnEscape
                    onCancelSearch={handleCancel}
                    placeholder={'Введите логин пользователя'}
                />
            </Box>
            {children || <Box mt={10} />}
            {userLogin && (
                <Box>
                    <UserDataGR searchValue={userLogin} />
                </Box>
            )}
        </>
    );
};
