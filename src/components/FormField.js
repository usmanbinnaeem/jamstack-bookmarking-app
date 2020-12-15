import React from "react"
import { Formik, Form, Field } from "formik"
import { useMutation } from "@apollo/client"
import { makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import gql from "graphql-tag"
import Grid from "@material-ui/core/Grid"

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  txtFld: {
    "& > *": {
      margin: theme.spacing(1),
      width: "50ch",
    },
  },
  btn: {
    margin: theme.spacing(1),
  }
}))

const BookMarkQuery = gql`
  {
    bookmark {
      id
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

const FormField = () => {
  const [addBookMark] = useMutation(addBookmarkMutation)
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Formik
        onSubmit={(value, actions) => {
          addBookMark({
            variables: {
              url: value.url,
              desc: value.desc,
            },
            refetchQueries: [{ query: BookMarkQuery }],
          })
          actions.resetForm({
            values: {
              url: "",
              desc: "",
            },
          })
        }}
        initialValues={{
          url: "",
          desc: "",
        }}
      >
        {formik => (
          <Grid container direction="row" justify="center" alignItems="center">
            <Form onSubmit={formik.handleSubmit}>
              <Grid item xs={6}>
                <Field
                  className={classes.txtFld}
                  as={TextField}
                  label="Url"
                  variant="outlined"
                  type="text"
                  name="url"
                  id="url"
                  placeholder="Add Url"
                />
              </Grid>
              <Grid item xs={6}>
                <Field
                  className={classes.txtFld}
                  as={TextField}
                  label="Description"
                  variant="outlined"
                  multiline
                  rowsMax={4}
                  type="desc"
                  name="desc"
                  id="desc"
                  placeholder="Add Description"
                />
              </Grid>
              <Grid item xs={12}>
                <Button className = {classes.btn} type="submit" variant="contained" color="primary">
                  submit
                </Button>
              </Grid>
            </Form>
          </Grid>
        )}
      </Formik>
    </div>
  )
}

export default FormField
