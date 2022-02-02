import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Modal, TextInput, TouchableHighlight } from 'react-native';
import Toast from 'react-native-simple-toast';
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid';

import Loading from '../misc/Loading';
import { Colours, Typography } from '../../styles';

const Comments = ({ navigation, walk }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isComplete, setIsComplete] = useState(false);
    const [comments, setComments] = useState(null);
    const [commentsFormatted, setCommentsFormatted] = useState(null);
    const [commentBody, setCommentBody] = useState("");
    const [modalVisible, setModalVisible] = useState(false);


    useEffect(() => {
        //get comments first
        // console.log(walk);
        if (walk.walkComments !== null) {
            fetchComments(walk);
        } else {
            setIsLoading(false);
        }
    }, [walk]);

    const fetchComments = (walk) => {
        let commentIds = {
            ids: []
        };

        if (walk?.walkComments?.length > 0) {
            commentIds.ids = walk.walkComments;

            fetch('https://dogwalknationapi.azurewebsites.net/Comment/getComments', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    commentIds
                )
            })
                .then(response => response.json())
                .then((data) => {
                    handleComments(data.comments)
                })
                .catch((error) => console.error(error));
        }
        else {
            setIsLoading(false);
        }
    }

    const handleComments = (comments) => {
        let tempComments = [];

        comments.forEach((comment, i) => {
            let date = new Date(Date.parse(comment.timestamp));
            let timestamp = `${date.getUTCHours()}:${date.getUTCMinutes()}  ${date.getUTCDay()}/${date.getUTCMonth()}/${date.getUTCFullYear()}`
            let temp =
                <View style={styles.comment} key={i}>
                    <Text></Text>
                    <Text style={styles.username}>{comment.username}</Text>
                    <Text style={styles.body}>{comment.commentBody}</Text>
                    <Text style={styles.timestamp}>{timestamp}</Text>
                    <View style={styles.break}></View>
                </View>;

            tempComments.push(temp);
        });
        tempComments.reverse();

        setCommentsFormatted(tempComments);
        setComments(comments);
        setIsLoading(false);
    }

    const createNewComment = () => {

        if (commentBody !== "") {


            //create comment object
            let date = new Date();
            let dateIso = date.toISOString();

            let newComment = {
                commentId: uuidv4(),
                userId: "c1b513c0-6188-4790-b9f0-f59b7a111720",
                username: "Frankles",
                timestamp: dateIso,
                commentBody: commentBody
            }

            // console.log(newComment);

            //send comment to db
            fetch('https://dogwalknationapi.azurewebsites.net/Comment/newComment', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    newComment
                )
            })
                .then(response => response.json())
                .then((data) => {
                    //update walk with new comment id
                    updateWalk(newComment);
                })
                .catch((error) => console.error(error));

            //Update comments somehow?
        } else {
            Toast.show("Please enter a comment!")
        }
    }

    const updateWalk = (newComment) => {
        //Update walk with new route ID
        // console.log(walk);
        let updatedWalk = walk;
        let currentComments = walk.walkComments;

        if (currentComments === null) {
            currentComments = [newComment.commentId];
        } else {
            currentComments.push(newComment.commentId);
        }

        updatedWalk = {
            ...updatedWalk,
            commentIds: currentComments
        }

        fetch('https://dogwalknationapi.azurewebsites.net/Walk/updateWalk', {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                updatedWalk
            )
        })
            .then(() => {
                setIsLoading(false);
                setIsComplete(true);
            })
            .catch((error) => console.error(error))
    }

    function goBackHandler() {
        setModalVisible(false);
        //Go back to walks page without a back button, the random number ensures that a refresh happens on return
        navigation.navigate("Walks", { refresh: Math.random() });
    }

    return (
        isLoading ?
            <Loading />
            :
            <>
                <View style={styles.headerGroup}>
                    <Text style={styles.header}>Comments</Text>
                    <Button title="Post Comment" color={Colours.primary.base} accessibilityLabel="This opens a modal to post a new comment" onPress={() => setModalVisible(true)} />
                </View>
                <ScrollView contentInsetAdjustmentBehavior='automatic'>
                    {!commentsFormatted ?
                        <Text style={styles.noComment}>No comments!</Text>
                        :
                        commentsFormatted
                    }
                </ScrollView>

                <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            {isLoading ?
                                <Loading />
                                :
                                <>
                                    {isComplete ?
                                        //Show this once finished
                                        <>
                                            <Text style={styles.modalHeader}>Successfully Added!</Text>
                                            <TouchableHighlight style={[styles.button, styles.buttonClose]} onPress={() => goBackHandler()} underlayColor={Colours.danger.light}>
                                                <Text style={styles.textStyle}>Close and return</Text>
                                            </TouchableHighlight>
                                        </>
                                        :
                                        <>
                                            <Text style={styles.modalHeader}>Post new comment?</Text>

                                            <Text style={styles.modalText}>Enter your new comment here:</Text>
                                            <TextInput
                                                style={styles.input}
                                                onChangeText={(text) => setCommentBody(text)}
                                                value={commentBody}
                                                multiline
                                                placeholder=""
                                            />

                                            <View style={styles.modalBreak}></View>
                                            <View style={styles.buttonGroup}>
                                                <TouchableHighlight style={[styles.button, styles.buttonClose]} onPress={() => setModalVisible(!modalVisible)} underlayColor={Colours.danger.light}>
                                                    <Text style={styles.textStyle}>Cancel</Text>
                                                </TouchableHighlight>
                                                <TouchableHighlight style={[styles.button, styles.buttonConfirm]} onPress={() => createNewComment()} underlayColor={Colours.primary.light}>
                                                    <Text style={styles.textStyle}> Post </Text>
                                                </TouchableHighlight>
                                            </View>
                                        </>
                                    }
                                </>
                            }
                        </View>
                    </View>
                </Modal>
            </>



    )
}

const styles = StyleSheet.create({
    comment: {
    },
    headerGroup: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    header: {
        ...Typography.header.largest,
        textAlign: "center",
    },
    username: {
        ...Typography.header.medium,
        paddingLeft: 5,
    },
    body: {
        ...Typography.body.medium,
        paddingLeft: 5,
    },
    timestamp: {
        textAlign: "right",
        paddingRight: 5
    },
    break: {
        width: "95%",
        marginLeft: "2.5%",
        borderBottomWidth: 1,
    },
    noComment: {
        ...Typography.header.large,
        textAlign: "center",
        marginTop: "25%",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    buttonGroup: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonConfirm: {
        backgroundColor: Colours.primary.base,
    },
    buttonClose: {
        backgroundColor: Colours.danger.base,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalHeader: {
        marginBottom: 10,
        ...Typography.header.largest
    },
    modalText: {
        ...Typography.body.medium,
        textAlign: "center"
    },
    modalBreak: {
        marginTop: 25,
        marginBottom: 20,
        width: "100%",
        borderBottomWidth: 1,
    },
    input: {
        borderWidth: 1,
        width: "80%",
        margin: 10,
        padding: 10,
    },
});

export default Comments;