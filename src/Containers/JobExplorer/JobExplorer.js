import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { parse, stringify } from 'query-string';

import { useQueryParams } from '../../Utilities/useQueryParams';
import { keysToCamel } from '../../Utilities/helpers';
import { Paths } from '../../paths';

import EmptyState from '../../Components/EmptyState';
import NoResults from '../../Components/NoResults';
import ApiErrorState from '../../Components/ApiErrorState';
import {
    preflightRequest,
    readJobExplorer,
    readJobExplorerOptions
} from '../../Api';
import { jobExplorer } from '../../Utilities/constants';

import {
    Main,
    PageHeader,
    PageHeaderTitle,
    Spinner
} from '@redhat-cloud-services/frontend-components';

import {
    Card,
    CardBody,
    Pagination,
    PaginationVariant
} from '@patternfly/react-core';

import JobExplorerList from '../../Components/JobExplorerList';
import FilterableToolbar from '../../Components/Toolbar/';

const perPageOptions = [
    { title: '5', value: 5 },
    { title: '10', value: 10 },
    { title: '15', value: 15 },
    { title: '20', value: 20 },
    { title: '25', value: 25 }
];

const initialQueryParams = {
    ...jobExplorer.defaultParams,
    attributes: jobExplorer.attributes
};

const JobExplorer = ({
    location: { search },
    history
}) => {
    const [ preflightError, setPreFlightError ] = useState(null);
    const [ apiError, setApiError ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ jobExplorerData, setJobExplorerData ] = useState([]);
    const [ meta, setMeta ] = useState({});
    const [ currPage, setCurrPage ] = useState(1);
    const [ explorerOptions, setExplorerOptions ] = useState({});

    let initialSearchParams = keysToCamel(
        parse(search, { arrayFormat: 'bracket' })
    );
    let combined = { ...initialQueryParams, ...initialSearchParams };
    const {
        queryParams,
        urlMappedQueryParams,
        setLimit,
        setOffset,
        setFromToolbar
    } = useQueryParams(combined);

    const updateURL = () => {
        const { jobExplorer } = Paths;
        const search = stringify(urlMappedQueryParams, { arrayFormat: 'bracket' });
        history.replace({
            pathname: jobExplorer,
            search
        });
    };

    useEffect(() => {
        insights.chrome.appNavClick({ id: 'job-explorer', secondaryNav: true });

        window.insights.chrome.auth.getUser()
        .then(() =>
            preflightRequest()
            .catch((error) => { setPreFlightError({ preflightError: error }); })
            // Loading is set false when the data also loaded
        );
    }, []);

    useEffect(() => {
        setApiError(null);
        setIsLoading(true);
        window.insights.chrome.auth.getUser()
        .then(() => {
            Promise.all([
                readJobExplorer({ params: urlMappedQueryParams }),
                readJobExplorerOptions({ params: urlMappedQueryParams })
            ]).then(([
                { items: jobExplorerData = [], meta = {}},
                options
            ]) => {
                setJobExplorerData(jobExplorerData);
                setMeta(meta);

                /* eslint-disable-next-line */
                const { attributes, groupBy, ...rest } = keysToCamel(options);
                setExplorerOptions(rest);
            })
            .catch(e => setApiError(e.error))
            .finally(() => {
                updateURL();
                setIsLoading(false);
            });
        });
    }, [ queryParams ]);

    const returnOffsetVal = page => (page - 1) * queryParams.limit;

    const handleSetPage = page => {
        const nextOffset = returnOffsetVal(page);
        setOffset(nextOffset);
        setCurrPage(page);
    };

    const handlePerPageSelect = (perPage, page) => {
        setLimit(perPage);
        const nextOffset = returnOffsetVal(page);
        setOffset(nextOffset);
        setCurrPage(page);
    };

    return (
        <>
            <PageHeader>
                <PageHeaderTitle title={ 'Job Explorer' } />
            </PageHeader>

            { preflightError && (
                <Main>
                    <EmptyState { ...preflightError } />
                </Main>
            ) }

            { !preflightError && (
                <Main>
                    <Card>
                        <CardBody>
                            <FilterableToolbar
                                categories={ explorerOptions }
                                filters={ queryParams }
                                setFilters={ setFromToolbar }
                                pagination={
                                    <Pagination
                                        itemCount={ meta && meta.count ? meta.count : 0 }
                                        widgetId="pagination-options-menu-top"
                                        perPageOptions={ perPageOptions }
                                        perPage={ queryParams.limit }
                                        page={ currPage }
                                        variant={ PaginationVariant.top }
                                        onPerPageSelect={ (_event, perPage, page) => {
                                            handlePerPageSelect(perPage, page);
                                        } }
                                        onSetPage={ (_event, pageNumber) => {
                                            handleSetPage(pageNumber);
                                        } }
                                        isCompact
                                    />
                                }
                                hasSettings
                            />
                            { apiError && <ApiErrorState message={ apiError } /> }
                            { !apiError && isLoading && <Spinner centered /> }
                            { !apiError && !isLoading && jobExplorerData.length <= 0 && <NoResults /> }
                            { !apiError && !isLoading && jobExplorerData.length > 0 && (<JobExplorerList jobs={ jobExplorerData } />) }
                            <Pagination
                                itemCount={ meta && meta.count ? meta.count : 0 }
                                widgetId="pagination-options-menu-bottom"
                                perPageOptions={ perPageOptions }
                                perPage={ queryParams.limit }
                                page={ currPage }
                                variant={ PaginationVariant.bottom }
                                onPerPageSelect={ (_event, perPage, page) => {
                                    handlePerPageSelect(perPage, page);
                                } }
                                onSetPage={ (_event, pageNumber) => {
                                    handleSetPage(pageNumber);
                                } }
                                style={ { marginTop: '20px' } }
                            />
                        </CardBody>
                    </Card>
                </Main>
            ) }
        </>
    );
};

JobExplorer.propTypes = {
    location: PropTypes.object,
    history: PropTypes.object
};

export default JobExplorer;
