import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import Card from "@material-ui/core/Card"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import { useMutation, useQuery } from "@apollo/client"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"
import gql from "graphql-tag"

const useStyles = makeStyles({
  root: {
    width: 500,
    margin: 20,
    padding: 30,
  },
  gri: {
    flexGrow: 1,
  },
  pos: {
    marginBottom: 12,
  },
})

const BookMarkQuery = gql`
  {
    bookmark {
      id
      url
      desc
    }
  }
`

const deleteBookmark = gql`
  mutation delBookmark($id: ID!) {
    delBookmark(id: $id) {
      url
      desc
    }
  }
`
const addBookmarkMutation = gql`
  mutation addBookMark($url: String!, $desc: String!) {
    addBookMark(url: $url, desc: $desc) {
      id
      url
      desc
    }
  }
`

const BookMarkList = () => {
  const classes = useStyles()
  const { loading, error, data } = useQuery(BookMarkQuery)
  const [delBookMark] = useMutation(deleteBookmark)
  const handleDelete = event => {
    delBookMark({
      variables: {
        id: event.currentTarget.value,
      },
      refetchQueries: [{ query: BookMarkQuery }],
    })
  }
  return (
    <div className={classes.gri}>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        {!loading &&
          data.bookmark.map(bkm => (
            <div key={bkm.id} className="div">
              <Grid item xs={6}>
                <Card className={classes.root}>
                  <CardContent>
                    <Typography
                      variant="h5"
                      component="h2"
                      gutterBottom
                    >
                      {bkm.desc}
                    </Typography>
                    <Typography variant="h5" component="h2" gutterBottom>
                      <a
                        style={{ textDecoration: "none" }}
                        href={bkm.url}
                        target="blank"
                      >
                        {bkm.url}
                      </a>
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      type="submit"
                      onClick={handleDelete}
                      value={bkm.id}
                      size="small"
                      variant="contained"
                      color="secondary"
                    >
                      <DeleteForeverIcon />
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </div>
          ))}
      </Grid>
    </div>
  )
}

export default BookMarkList
