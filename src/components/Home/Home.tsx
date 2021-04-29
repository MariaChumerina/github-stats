import React, { useContext, useEffect, useState } from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { AuthContext } from '../../App';
import { AuthContextType } from '../../types/appTypes';
import { Container, Box, Grid, Button } from '@material-ui/core';
import './Home.css';
import { sessionSaver } from '../../utils/SessionSaver';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { SearchedUser } from './SearchedUser';

const useStyles = makeStyles(() =>
    createStyles({
        container: {
            maxWidth: '90%'
        }
    })
);

type setState = (value: string) => void;

export const Home: React.FC = () => {
    const classes = useStyles();
    const {
        state: { isLoggedIn }
    } = useContext<AuthContextType>(AuthContext);

    const [searchUserValue, setSearchUserValue] = useState<string>('');
    const [searchUserValue2, setSearchUserValue2] = useState<string>('');
    const [userLogin, setUserLogin] = useState<string>('');
    const [userLogin2, setUserLogin2] = useState<string>('');
    const { searched } = useParams<{ searched: string }>();
    const [toggleSecondUser, setToggleSecondUser] = useState<boolean>(false);

    const history = useHistory();

    const onSearch = (userName: string, isSecondUser = false) => {
        history.push(userName);

        if (searchUserValue2) {
            history.push(`${userName}&${searchUserValue2}`);
        }

        if (isSecondUser) {
            history.push(`${searchUserValue}&${userName}`);
        }
    };

    const searchUser = (searchUserValue: string, setLogin: setState) => {
        sessionSaver.setUserName(searchUserValue);
        setLogin(searchUserValue);
    };

    if (!isLoggedIn) {
        return <Redirect to="/login" />;
    }

    const handleSearch = (searchValue: string, setState: setState) => {
        setState('');
        setState(searchValue);
    };

    const deleteSecondUser = () => {
        setToggleSecondUser(false);
        history.push(searchUserValue);
        setSearchUserValue2('');
        setUserLogin2('');
    };

    const handleCancel = () => history.push('/');

    const renderAddUserButton = (setToggleSecondUser: (isSecondUserToggle: boolean) => void) => {
        return (
            <Box display="flex" justifyContent="center" my={3}>
                <Button variant="contained" color="secondary" onClick={setToggleSecondUser.bind(null, true)}>
                    Добавить пользователя
                </Button>
            </Box>
        );
    };

    useEffect(() => {
        const delimiterPosition = searched ? searched.indexOf('&') : -1;
        const hasSecondUser = delimiterPosition !== -1;

        if (hasSecondUser) {
            const userName1 = searched.slice(0, delimiterPosition);
            const userName2 = searched.slice(delimiterPosition + 1);

            setSearchUserValue(userName1);
            searchUser(userName1, setUserLogin);
            setSearchUserValue2(userName2);
            searchUser(userName2, setUserLogin2);
            setToggleSecondUser(true);
        } else {
            setSearchUserValue(searched);
            searchUser(searched, setUserLogin);
        }
    }, [searched]);

    return (
        <Container className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={toggleSecondUser ? 6 : 12}>
                    <SearchedUser
                        searchValue={searchUserValue}
                        setSearchValue={setSearchUserValue}
                        handleSearch={handleSearch}
                        onSearch={onSearch}
                        userLogin={userLogin}
                        handleCancel={handleCancel}
                        isSecondUser={false}
                    >
                        {!toggleSecondUser && searched && renderAddUserButton(setToggleSecondUser)}
                    </SearchedUser>
                </Grid>
                {toggleSecondUser && (
                    <Grid item xs={12} md={6}>
                        <SearchedUser
                            searchValue={searchUserValue2}
                            setSearchValue={setSearchUserValue2}
                            handleSearch={handleSearch}
                            onSearch={onSearch}
                            userLogin={userLogin2}
                            handleCancel={handleCancel}
                            isSecondUser={true}
                        >
                            <Box display="flex" justifyContent="center" mt={3} mb={2.5}>
                                <Button variant="contained" color="secondary" onClick={deleteSecondUser}>
                                    Убрать пользователя
                                </Button>
                            </Box>
                        </SearchedUser>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};
